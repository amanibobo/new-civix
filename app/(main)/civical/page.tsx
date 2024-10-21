"use client";

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, Bell, Heart, Rocket, Briefcase, Code, Database, X } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

type TagProps = {
  text: string;
  color: string;
  onClick?: () => void;
  removable?: boolean;
};

type CategoryCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

type PolicyCardProps = {
  title: string;
  description: string;
  tags: string[];
  onClick: () => void;
};

type PolicyItem = {
  title: string;
  description: string;
  tags: string[];
};

const Tag: React.FC<TagProps> = ({ text, color, onClick, removable = false }) => (
  <span 
    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${color} mr-2 mb-2 ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    {text}
    {removable && <X className="ml-1 h-3 w-3" />}
  </span>
)

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, description }) => (
  <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg font-semibold ml-3">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      <Button variant="link" className="mt-4 p-0 h-auto font-semibold text-blue-600">
        Browse Category
      </Button>
    </CardContent>
  </Card>
)

const PolicyCard: React.FC<PolicyCardProps> = ({ title, description, tags, onClick }) => (
  <Card className="overflow-hidden border border-gray-200 shadow-sm cursor-pointer transition-shadow hover:shadow-md" onClick={onClick}>
    <CardContent className="p-4">
      <h3 className="font-semibold text-lg mb-2 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex flex-wrap items-center mt-4">
        {tags.map((tag, index) => (
          <Tag key={index} text={tag} color={
            tag === 'Policy' ? 'bg-blue-100 text-blue-800' :
            tag === 'Economic' ? 'bg-green-100 text-green-800' :
            tag === 'Democratic' ? 'bg-purple-100 text-purple-800' :
            tag === 'Republican' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          } />
        ))}
      </div>
    </CardContent>
  </Card>
)

const PolicyCardSkeleton = () => (
  <Card className="overflow-hidden border border-gray-200 shadow-sm">
    <CardContent className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <div className="flex flex-wrap items-center mt-4">
        <Skeleton className="h-6 w-16 mr-2" />
        <Skeleton className="h-6 w-16 mr-2" />
        <Skeleton className="h-6 w-16" />
      </div>
    </CardContent>
  </Card>
)

export default function CivixMarketplace() {
  const [selectedItem, setSelectedItem] = useState<PolicyItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visibleItems, setVisibleItems] = useState<number>(9);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories: string[] = ['All', 'Democratic', 'Republican', 'Economic', 'Foreign Policy', 'Healthcare'];
  const policyItems: PolicyItem[] = [
    {
      title: "Healthcare Reform Bill",
      description: "Comprehensive healthcare reform aimed at expanding coverage and reducing costs.",
      tags: ['Healthcare', 'Democratic'],
    },
    {
      title: "Tax Simplification Act",
      description: "Proposal to streamline the tax code and reduce bureaucracy.",
      tags: ['Economic', 'Republican'],
    },
    {
      title: "Green Energy Initiative",
      description: "Plan to invest in renewable energy sources and reduce carbon emissions.",
      tags: ['Policy', 'Democratic'],
    },
    {
      title: "Small Business Support Program",
      description: "Initiative to provide financial assistance and resources to small businesses.",
      tags: ['Economic', 'Republican'],
    },
    {
      title: "Education Reform Act",
      description: "Comprehensive plan to improve public education and increase funding for schools.",
      tags: ['Policy', 'Democratic'],
    },
    {
      title: "Infrastructure Modernization Plan",
      description: "Large-scale project to upgrade and expand national infrastructure.",
      tags: ['Economic', 'Bipartisan'],
    },
    {
      title: "Cybersecurity Enhancement Act",
      description: "Legislation to strengthen national cybersecurity defenses and protect critical infrastructure.",
      tags: ['Policy', 'Bipartisan'],
    },
    {
      title: "Immigration Reform Bill",
      description: "Comprehensive approach to address immigration challenges and border security.",
      tags: ['Policy', 'Bipartisan'],
    },
    {
      title: "Renewable Energy Tax Credit",
      description: "Proposal to extend and expand tax credits for renewable energy investments.",
      tags: ['Economic', 'Democratic'],
    },
    {
      title: "Veterans Healthcare Improvement Act",
      description: "Initiative to enhance healthcare services and support for veterans.",
      tags: ['Healthcare', 'Bipartisan'],
    },
    {
      title: "AI Regulation Framework",
      description: "Proposed guidelines for the ethical development and use of artificial intelligence.",
      tags: ['Policy', 'Technology'],
    },
    {
      title: "Universal Basic Income Pilot",
      description: "Experimental program to test the effects of a universal basic income.",
      tags: ['Economic', 'Democratic'],
    },
    {
      title: "Corporate Tax Reform",
      description: "Plan to adjust corporate tax rates and close loopholes.",
      tags: ['Economic', 'Republican'],
    },
    {
      title: "Mental Health Parity Act",
      description: "Legislation to ensure equal coverage for mental health and substance use disorders.",
      tags: ['Healthcare', 'Bipartisan'],
    },
    {
      title: "Clean Water Initiative",
      description: "Program to improve water quality and infrastructure across the nation.",
      tags: ['Policy', 'Environmental'],
    },
    {
      title: "Space Exploration Funding Bill",
      description: "Proposal to increase funding for space exploration and research.",
      tags: ['Policy', 'Science'],
    },
    {
      title: "Affordable Housing Act",
      description: "Comprehensive plan to address housing affordability and homelessness.",
      tags: ['Policy', 'Democratic'],
    },
    {
      title: "Rural Development Program",
      description: "Initiative to stimulate economic growth and improve services in rural areas.",
      tags: ['Economic', 'Bipartisan'],
    },
    {
      title: "Data Privacy Protection Act",
      description: "Legislation to strengthen consumer data privacy rights and regulations.",
      tags: ['Policy', 'Technology'],
    },
    {
      title: "Renewable Energy Grid Modernization",
      description: "Plan to upgrade the power grid to better accommodate renewable energy sources.",
      tags: ['Policy', 'Environmental'],
    },
  ];

  const filteredPolicyItems = useMemo<PolicyItem[]>(() => {
    return policyItems.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.tags.includes(activeCategory);
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => item.tags.includes(tag));
      return matchesCategory && matchesSearch && matchesTags;
    });
  }, [activeCategory, searchQuery, selectedTags]);

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [activeCategory, searchQuery, selectedTags])

  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + 9);
  }

  const handleTagClick = (tag: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const allTags: string[] = Array.from(new Set(policyItems.flatMap(item => item.tags)));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">Civix</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Policy Marketplace
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Orgs
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Studio
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Apps
                </a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative w-96">
                <Input 
                  type="text" 
                  placeholder="Search policies..." 
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <button className="ml-3 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Heart className="h-6 w-6" />
              </button>
              <button className="ml-3 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="h-6 w-6" />
              </button>
              <div className="ml-3 relative">
                <div>
                  <button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="user-menu" aria-expanded="false" aria-haspopup="true">
                    <span className="sr-only">Open user menu</span>
                    <Image className="h-8 w-8 rounded-full" src="/placeholder.svg?height=32&width=32" alt="" width={32} height={32} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Top Categories</h2>
            <Button variant="link" className="text-blue-600 font-semibold">
              View All Categories
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard 
              icon={<Briefcase className="h-8 w-8 text-blue-500" />}
              title="Economic"
              description="Policies related to finance, taxes, and economic growth."
            />
            <CategoryCard 
              icon={<Heart className="h-8 w-8 text-red-500" />}
              title="Healthcare"
              description="Proposals for improving healthcare access and quality."
            />
            <CategoryCard 
              icon={<Rocket className="h-8 w-8 text-purple-500" />}
              title="Technology"
              description="Initiatives for advancing technological innovation."
            />
            <CategoryCard 
              icon={<Database className="h-8 w-8 text-green-500" />}
              title="Environment"
              description="Policies aimed at environmental protection and sustainability."
            />
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Featured Policies</h2>
            <Button variant="link" className="text-blue-600 font-semibold">
              View All Policies
            </Button>
          </div>
          <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <Button 
                key={index} 
                variant={activeCategory === category ? "default" : "outline"} 
                className={`border-blue-500 ${activeCategory === category ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'}`}
                onClick={() => setActiveCategory(category)}
                disabled={isLoading}
              >
                {category}
              </Button>
            ))}
          </div>
          <div  className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Filter by Tags:</h3>
            <div className="flex flex-wrap">
              {allTags.map((tag, index) => (
                <Tag
                  key={index}
                  text={tag}
                  color={selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
                  onClick={() => handleTagClick(tag)}
                  removable={selectedTags.includes(tag)}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(9).fill(0).map((_, index) => (
                <PolicyCardSkeleton key={index} />
              ))
            ) : (
              filteredPolicyItems.slice(0, visibleItems).map((item, index) => (
                <PolicyCard
                  key={index}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  onClick={() => setSelectedItem(item)}
                />
              ))
            )}
          </div>
          {!isLoading && filteredPolicyItems.length > visibleItems && (
            <div className="text-center mt-8">
              <Button onClick={loadMore} className="bg-blue-500 hover:bg-blue-600 text-white">
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
            <DialogDescription>{selectedItem?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700">Detailed policy information would go here.</p>
            <div className="flex flex-wrap items-center mt-4">
              {selectedItem?.tags.map((tag, index) => (
                <Tag key={index} text={tag} color={
                  tag === 'Policy' ? 'bg-blue-100 text-blue-800' :
                  tag === 'Economic' ? 'bg-green-100 text-green-800' :
                  tag === 'Democratic' ? 'bg-purple-100 text-purple-800' :
                  tag === 'Republican' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                } />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}